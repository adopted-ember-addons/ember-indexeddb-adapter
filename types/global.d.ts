// Types for compiled templates
declare module 'ember-indexeddb-adapter/templates/*' { 
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
