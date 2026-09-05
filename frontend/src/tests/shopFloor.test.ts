import { describe, it, expect } from 'vitest';

export type Workstation = 'saw1' | 'saw2' | 'cnc' | 'polish';
export type CutStage = 'queued' | 'in_progress' | 'completed';

export interface ShopJob {
  id: string;
  jobName: string;
  lotNumber: string;
  communityName: string;
  material: string;
  sqft: number;
  assignedStation: Workstation;
  stage: CutStage;
  isRush?: boolean;
  priorityScore: number;
}

export function filterShopQueue(
  jobs: ShopJob[],
  station: Workstation | 'all',
  stage: CutStage | 'all'
): ShopJob[] {
  return jobs.filter(j => {
    const matchStation = station === 'all' || j.assignedStation === station;
    const matchStage = stage === 'all' || j.stage === stage;
    return matchStation && matchStage;
  });
}

export function advanceJobStage(job: ShopJob): ShopJob {
  if (job.stage === 'queued') {
    return { ...job, stage: 'in_progress' };
  } else if (job.stage === 'in_progress') {
    return { ...job, stage: 'completed' };
  }
  return job;
}

export function sortQueueByPriority(jobs: ShopJob[]): ShopJob[] {
  return [...jobs].sort((a, b) => {
    // Rush jobs always first
    if (a.isRush && !b.isRush) return -1;
    if (!a.isRush && b.isRush) return 1;
    // Otherwise higher priorityScore first
    return b.priorityScore - a.priorityScore;
  });
}

export function calculateStationLoadSqft(jobs: ShopJob[], station: Workstation): number {
  return jobs
    .filter(j => j.assignedStation === station && j.stage !== 'completed')
    .reduce((sum, j) => sum + j.sqft, 0);
}

describe('Shop Floor Kiosk Subsystem', () => {
  const sampleShopJobs: ShopJob[] = [
    {
      id: 'sj_1',
      jobName: 'JOB-2026-001',
      lotNumber: '104',
      communityName: 'Silver Creek',
      material: 'Calacatta Gold Quartz',
      sqft: 65,
      assignedStation: 'saw1',
      stage: 'queued',
      isRush: false,
      priorityScore: 50
    },
    {
      id: 'sj_2',
      jobName: 'JOB-2026-002',
      lotNumber: '210',
      communityName: 'Highland Park',
      material: 'Nero Marquina',
      sqft: 80,
      assignedStation: 'saw1',
      stage: 'queued',
      isRush: true,
      priorityScore: 90
    },
    {
      id: 'sj_3',
      jobName: 'JOB-2026-003',
      lotNumber: '302',
      communityName: 'Silver Creek',
      material: 'Taj Mahal Quartzite',
      sqft: 95,
      assignedStation: 'cnc',
      stage: 'in_progress',
      isRush: false,
      priorityScore: 60
    }
  ];

  it('filters station cut queue by selected workstation', () => {
    const saw1Jobs = filterShopQueue(sampleShopJobs, 'saw1', 'all');
    expect(saw1Jobs.length).toBe(2);
    expect(saw1Jobs.every(j => j.assignedStation === 'saw1')).toBe(true);

    const cncJobs = filterShopQueue(sampleShopJobs, 'cnc', 'all');
    expect(cncJobs.length).toBe(1);
    expect(cncJobs[0].id).toBe('sj_3');
  });

  it('advances job stage from queued to in_progress to completed with one tap', () => {
    const queuedJob = sampleShopJobs[0];
    expect(queuedJob.stage).toBe('queued');

    const inProgressJob = advanceJobStage(queuedJob);
    expect(inProgressJob.stage).toBe('in_progress');

    const completedJob = advanceJobStage(inProgressJob);
    expect(completedJob.stage).toBe('completed');

    // Advancing an already completed job remains completed
    const stillCompleted = advanceJobStage(completedJob);
    expect(stillCompleted.stage).toBe('completed');
  });

  it('sorts jobs by priority and places rush jobs at top of cutting queue', () => {
    const sorted = sortQueueByPriority(sampleShopJobs);
    expect(sorted[0].id).toBe('sj_2'); // Rush job
    expect(sorted[0].isRush).toBe(true);
    expect(sorted[1].priorityScore).toBeGreaterThanOrEqual(sorted[2].priorityScore);
  });

  it('calculates total active SQFT machine workload per workstation', () => {
    // Saw1 has sj_1 (65 sqft) + sj_2 (80 sqft) both active = 145 sqft
    const saw1Load = calculateStationLoadSqft(sampleShopJobs, 'saw1');
    expect(saw1Load).toBe(145);

    // CNC has sj_3 (95 sqft)
    const cncLoad = calculateStationLoadSqft(sampleShopJobs, 'cnc');
    expect(cncLoad).toBe(95);

    // Polish has 0 active jobs
    const polishLoad = calculateStationLoadSqft(sampleShopJobs, 'polish');
    expect(polishLoad).toBe(0);
  });
});
