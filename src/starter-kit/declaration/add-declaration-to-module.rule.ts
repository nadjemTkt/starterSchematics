import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';
import * as ts from 'typescript';
import { addSymbolToNgModuleMetadata } from '../../utility/ast-utils';
import { InsertChange } from "../../utility/change";
import { Schema } from '../schema';

export function addDeclarationToAppModule(appModule: string, option: Schema, type: string): Rule {
    return (host: Tree) => {
      if (!appModule) {
        return host;
      }

      /* console.log({option}) */
      let data  = option.module.split('/')
      let poped = data.splice(-1,1)
 /*  console.log(typeof data) */
      let res = data.join('/')
 /*  console.log({module:res})
     console.log({'_options.path':option.path}) */
 
      const isFullCustom = (option.module !== 'src/app/app.module.ts' && option.path !== 'src/app') && (res === option.path)
      // Part I: Construct path and read file
      const modulePath = normalize('/' + appModule);
      const text = host.read(modulePath);
      if (text === null) {
        throw new SchematicsException(`${modulePath} does not exist.`);
      }
      const sourceText = text.toString('utf-8');
      const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
      // Part II: Find out, what to change
           
      const componentPath = option.path === 'src/app' || isFullCustom ? kebab(option.name) : (!!option.dataName ? kebab(option.name) : (kebab(option.path).replace('src/app/','') +'/'+ kebab(option.name)))
      const typeDeclaration = type === 'declarations' ? capitalize('component') : (type === 'providers' ? capitalize('service'):capitalize('module'))
      const changes = addSymbolToNgModuleMetadata(
        source, 
        modulePath, 
        type, 
        capitalize(option.name)+typeDeclaration, 
        './'+componentPath+'/'+kebab(option.name)+(type === 'declarations' ? '.component':(type === 'providers' ? '.service': '.module')));

      // Part III: Apply changes
      const recorder = host.beginUpdate(modulePath);
      
      for (const change of changes) {
        if (change instanceof InsertChange) {
          recorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(recorder);

      return host;
    };
  }

  const capitalize = (s:string) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  const kebab = (s:string) => {
    return s.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};