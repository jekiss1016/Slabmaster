import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Application Documentation & Help File Maintenance (Rule 6)', () => {
  const helpHtmlPath = path.resolve(__dirname, '../../public/help.html');

  it('verifies help.html exists in public directory for static serving', () => {
    expect(fs.existsSync(helpHtmlPath)).toBe(true);
  });

  it('verifies help.html contains mandatory anchor sections for all core and new features', () => {
    const content = fs.readFileSync(helpHtmlPath, 'utf8');

    const expectedAnchors = [
      'id="overview"',
      'id="accounts"',
      'id="jobs"',
      'id="calendar"',
      'id="inventory"',
      'id="purchasing"',
      'id="shop-kiosk"',
      'id="custom-attributes"',
      'id="table-matrix"',
      'id="forms"',
      'id="settings"',
      'id="api-integration"',
      'id="subscriber-onboarding"',
      'id="video-tutorials"'
    ];

    expectedAnchors.forEach(anchor => {
      expect(content).toContain(anchor);
    });
  });

  it('verifies help.html contains navigation links to each anchor', () => {
    const content = fs.readFileSync(helpHtmlPath, 'utf8');

    const expectedLinks = [
      'href="#overview"',
      'href="#accounts"',
      'href="#jobs"',
      'href="#calendar"',
      'href="#inventory"',
      'href="#purchasing"',
      'href="#shop-kiosk"',
      'href="#custom-attributes"',
      'href="#table-matrix"',
      'href="#forms"',
      'href="#settings"',
      'href="#api-integration"',
      'href="#subscriber-onboarding"',
      'href="#video-tutorials"'
    ];

    expectedLinks.forEach(link => {
      expect(content).toContain(link);
    });
  });

  it('verifies the persistent copyright and version text is present in help.html', () => {
    const content = fs.readFileSync(helpHtmlPath, 'utf8');
    expect(content).toContain('© 2026 SlabMaster');
    expect(content).toContain('v1.0.0');
  });

  it('verifies help.html and user_help_guide.html link directly to the official YouTube channel', () => {
    const helpContent = fs.readFileSync(helpHtmlPath, 'utf8');
    const userGuidePath = path.resolve(__dirname, '../../../documents/03_Subscriber_Guides/user_help_guide.html');
    const userGuideContent = fs.readFileSync(userGuidePath, 'utf8');

    const expectedYtUrl = 'https://www.youtube.com/channel/UCVMMMRplZnCrfM8NEwaEHDw';
    expect(helpContent).toContain(expectedYtUrl);
    expect(userGuideContent).toContain(expectedYtUrl);

    // Verify channel ID is present
    expect(helpContent).toContain('UCVMMMRplZnCrfM8NEwaEHDw');
    expect(userGuideContent).toContain('UCVMMMRplZnCrfM8NEwaEHDw');
  });

  it('verifies in-app Help Center modal in App.tsx links to official YouTube channel', () => {
    const appTsxPath = path.resolve(__dirname, '../App.tsx');
    const appContent = fs.readFileSync(appTsxPath, 'utf8');
    expect(appContent).toContain('https://www.youtube.com/channel/UCVMMMRplZnCrfM8NEwaEHDw');
    expect(appContent).toContain('YouTube Tutorials');
  });
});
