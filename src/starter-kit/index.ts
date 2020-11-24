import {chain, Rule, SchematicContext, Tree, apply, mergeWith, template, url, move,branchAndMerge } from '@angular-devkit/schematics';
import { strings, join, Path } from '@angular-devkit/core'
import { getWorkspace } from "@schematics/angular/utility/config";
import { Schema } from './schema';
import { addDeclarationToAppModule } from './add-declaration-to-module.rule';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function generateComponent(_options: Schema): Rule {
  console.log('starterKit called')
  return (tree: Tree, _context: SchematicContext) => {
    return chain([
      starterComponent(_options,tree,_context),
      ngAdd(_options,tree,_context)
    ])(tree, _context);
  };
  
}

export function starterComponent(_options: Schema, tree: Tree, _context: SchematicContext): Rule {
  return () => {
    if(!tree){
      return
    }
    let path = _options.path ? _options.path : 'src/app'
    const sourceTemplates = url('./templates');
    
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options,
        ...strings
      }),
      move(path),
    ]);
    
    return mergeWith(sourceParametrizedTemplates);
  };
}

export function ngAdd(_options: Schema,tree: Tree, _context: SchematicContext): Rule {
console.log('called add')
  return () => {
    const appModule = 'src/app/app.module.ts';
    let rule = branchAndMerge(addDeclarationToAppModule(appModule, _options));
    return rule(tree, _context);
  };

}
