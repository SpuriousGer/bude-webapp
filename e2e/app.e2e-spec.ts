import { BudeWebappPage } from './app.po';

describe('bude-webapp App', () => {
  let page: BudeWebappPage;

  beforeEach(() => {
    page = new BudeWebappPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
