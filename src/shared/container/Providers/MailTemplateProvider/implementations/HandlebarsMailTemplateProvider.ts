import handlebars from 'handlebars';
import fs from 'fs';

import IMailTemplateProvider from '../models/ITemplateMailProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
	public async parse({
		file,
		variables,
	}: IParseMailTemplateDTO): Promise<string> {
		const tempalteFileContent = await fs.promises.readFile(file, {
			encoding: 'utf-8',
		});

		const parseTemplate = handlebars.compile(tempalteFileContent);

		return parseTemplate(variables);
	}
}

export default HandlebarsMailTemplateProvider;
