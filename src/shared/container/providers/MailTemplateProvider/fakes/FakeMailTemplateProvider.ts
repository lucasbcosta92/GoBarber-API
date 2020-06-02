import IMailTemplateProvider from '../models/IMailTemplateProvider';

class FakeMalTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}

export default FakeMalTemplateProvider;
