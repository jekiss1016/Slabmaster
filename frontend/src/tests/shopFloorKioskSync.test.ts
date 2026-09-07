import { describe, it, expect } from 'vitest';

describe('Shop Floor Kiosk & Job Activity Synchronization', () => {
  interface MockActivity {
    id: string;
    activityName: string;
    status: 'Scheduled' | 'In Progress' | 'Complete';
  }

  interface MockJob {
    id: string;
    jobName: string;
    activities: MockActivity[];
  }

  function syncKioskStationCompletion(
    jobs: MockJob[],
    targetJobName: string,
    station: string
  ): MockJob[] {
    return jobs.map((job) => {
      const isMatch =
        job.jobName.toLowerCase().includes(targetJobName.toLowerCase()) ||
        targetJobName.toLowerCase().includes(job.jobName.toLowerCase()) ||
        job.id.toLowerCase() === targetJobName.toLowerCase();
      if (!isMatch) return job;

      const updatedActivities = job.activities.map((act) => {
        const actName = act.activityName.toLowerCase();
        const stationLower = station.toLowerCase();
        const matches =
          (stationLower.includes('saw') && actName.includes('saw')) ||
          (stationLower.includes('polish') && actName.includes('polish')) ||
          (stationLower.includes('quality') && actName.includes('qc')) ||
          (stationLower.includes('cut') && actName.includes('fab')) ||
          actName.includes('fabricat');
        if (matches) {
          return { ...act, status: 'Complete' as const };
        }
        return act;
      });

      return { ...job, activities: updatedActivities };
    });
  }

  const initialJobs: MockJob[] = [
    {
      id: 'job_101',
      jobName: 'LNXAUS_000036_000_01',
      activities: [
        { id: 'act_1', activityName: 'Field Templating', status: 'Complete' },
        { id: 'act_2', activityName: 'CNC Sawjet Cutting', status: 'In Progress' },
        { id: 'act_3', activityName: 'Edge Polish & Miter', status: 'Scheduled' },
        { id: 'act_4', activityName: 'Final Stone Quality Walk', status: 'Scheduled' },
        { id: 'act_5', activityName: 'Stone Installation', status: 'Scheduled' }
      ]
    },
    {
      id: 'job_102',
      jobName: 'WESBCH_000042_000_01',
      activities: [
        { id: 'act_6', activityName: 'Stone Fabrication & Polish', status: 'Scheduled' }
      ]
    }
  ];

  it('updates CNC Sawjet activity to Complete when station reports completion', () => {
    const updated = syncKioskStationCompletion(initialJobs, 'LNXAUS_000036_000_01', 'CNC Sawjet');
    const targetJob = updated.find((j) => j.id === 'job_101');
    const sawActivity = targetJob?.activities.find((a) => a.id === 'act_2');
    const polishActivity = targetJob?.activities.find((a) => a.id === 'act_3');

    expect(sawActivity?.status).toBe('Complete');
    expect(polishActivity?.status).toBe('Scheduled');
  });

  it('updates Edge Polish activity when polish station reports completion', () => {
    const updated = syncKioskStationCompletion(initialJobs, 'LNXAUS_000036_000_01', 'Hand Polish / Miter Assembly');
    const targetJob = updated.find((j) => j.id === 'job_101');
    const polishActivity = targetJob?.activities.find((a) => a.id === 'act_3');

    expect(polishActivity?.status).toBe('Complete');
  });

  it('falls back to updating general Fabrication activity if specific station is generic', () => {
    const updated = syncKioskStationCompletion(initialJobs, 'WESBCH_000042_000_01', 'Saw Station 1');
    const targetJob = updated.find((j) => j.id === 'job_102');
    const fabActivity = targetJob?.activities.find((a) => a.id === 'act_6');

    expect(fabActivity?.status).toBe('Complete');
  });
});

describe('Job Detail File Attachment & Scanner Buffer Utilities', () => {
  function formatAttachmentSize(bytes: number): string {
    return bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(bytes / 1024)} KB`;
  }

  function extractFileExtension(filename: string): string {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  }

  it('formats attachment file sizes accurately in KB and MB', () => {
    expect(formatAttachmentSize(512000)).toBe('500 KB');
    expect(formatAttachmentSize(1048576)).toBe('1024 KB');
    expect(formatAttachmentSize(3250585)).toBe('3.1 MB');
    expect(formatAttachmentSize(15728640)).toBe('15.0 MB');
  });

  it('extracts uppercase extensions for technical stone fabrication files', () => {
    expect(extractFileExtension('Island_Countertop_Layout.pdf')).toBe('PDF');
    expect(extractFileExtension('Waterjet_Profile_Cut.dxf')).toBe('DXF');
    expect(extractFileExtension('Slab_Vein_Photo.jpg')).toBe('JPG');
    expect(extractFileExtension('Cabinet_Specs.DWG')).toBe('DWG');
    expect(extractFileExtension('README')).toBe('README');
  });

  it('identifies rapid keystroke intervals typical of physical Zebra wedge scanners', () => {
    const isWedgeScannerBurst = (intervals: number[]): boolean => {
      // Hardware scan guns produce character intervals < 65ms
      return intervals.length >= 3 && intervals.every((ms) => ms <= 65);
    };

    const scannerBurst = [18, 22, 19, 25, 20, 15];
    const humanTyping = [180, 240, 95, 310, 150];

    expect(isWedgeScannerBurst(scannerBurst)).toBe(true);
    expect(isWedgeScannerBurst(humanTyping)).toBe(false);
  });
});
