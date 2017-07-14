import { CtgCovPage } from './app.po';

describe('ctg-cov App', () => {
  let page: CtgCovPage;

  beforeEach(() => {
    page = new CtgCovPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
