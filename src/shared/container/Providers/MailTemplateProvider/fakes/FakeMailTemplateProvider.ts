import IMailTemplateProvider from '../models/ITemplateMailProvider';

class FakeMailTemplateProvider implements IMailTemplateProvider {
	public async parse(): Promise<string> {
		return 'Template';
	}
}

export default FakeMailTemplateProvider;
