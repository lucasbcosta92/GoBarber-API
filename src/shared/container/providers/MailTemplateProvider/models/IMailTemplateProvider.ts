import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplatePRovider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
