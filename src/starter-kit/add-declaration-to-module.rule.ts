import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';
import * as ts from 'typescript';
import { addSymbolToNgModuleMetadata } from '../utility/ast-utils';
import { InsertChange } from "../utility/change";
import { Schema } from './schema';

export function addDeclarationToAppModule(appModule: string, option: Schema): Rule {
    return (host: Tree) => {
      if (!appModule) {
        return host;
      }
      // Part I: Construct path and read file
      const modulePath = normalize('/' + appModule);
      const text = host.read(modulePath);
      if (text === null) {
        throw new SchematicsException(`${modulePath} does not exist.`);
      }
      const sourceText = text.toString('utf-8');
      const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
      // Part II: Find out, what to change
/*       console.log({source})
 */      
      const changes = addSymbolToNgModuleMetadata(source, modulePath, 'declarations', capitalize(option.name)+capitalize('component'), './'+option.name+'/'+option.name+'.component');

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