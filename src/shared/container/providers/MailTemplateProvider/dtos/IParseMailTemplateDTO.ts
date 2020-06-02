interface ITemplateVariables {
  // essa forma de declaração permite recebermos qualquer varivel, visto que varia de acordo com o tipo de email
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
