interface ITemplateVariavles {
	[key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
	file: string;
	variables: ITemplateVariavles;
}
