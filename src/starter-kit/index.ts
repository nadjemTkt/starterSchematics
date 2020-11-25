import {chain, Rule, SchematicContext, Tree, apply, mergeWith, template, url, move,branchAndMerge, SchematicsException } from '@angular-devkit/schematics';
import { strings, join, Path } from '@angular-devkit/core'
import { getWorkspace } from "@schematics/angular/utility/config";
import { Schema } from './schema';
import { addDeclarationToAppModule } from './add-declaration-to-module.rule';
import { parseName } from "@schematics/angular/utility/parse-name"
import { buildDefaultPath } from '@schematics/angular/utility/project';
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function generateComponent(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read("angular.json");
    if(!workspaceConfigBuffer){
      throw new SchematicsException('Not an Angular CLI workspace');
    }
    const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
    const projectName = _options.project || workspaceConfig.defaultProject;
    const project = workspaceConfig.projects[projectName];

    const defaultProjectPath = buildDefaultPath(project);

    const parsedPath = parseName(defaultProjectPath, _options.name)
    const {name, path} = parsedPath;
    console.log({name,path})
    return chain([
      starterComponent(_options,tree,_context),
      moduleAddComponent(_options,tree,_context),
      addService(_options,tree,_context),
      moduleAddService(_options,tree,_context)
    ])(tree, _context);
  };
  
}

function starterComponent(_options: Schema, tree: Tree, _context: SchematicContext): Rule {
  return () => {
    if(!tree){
      return
    }
    const path = _options.path ? _options.path : 'src/app'
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

function moduleAddComponent(_options: Schema,tree: Tree, _context: SchematicContext): Rule {
  return () => {
    const appModule = _options.module ? _options.module : 'src/app/app.module.ts';
    const rule = branchAndMerge(addDeclarationToAppModule(appModule, _options, 'declarations'));
    return rule(tree, _context);
  };
}
function moduleAddService(_options: Schema,tree: Tree, _context: SchematicContext): Rule {
  return () => {
    const appModule = _options.module ? _options.module : 'src/app/app.module.ts';
    const rule = branchAndMerge(addDeclarationToAppModule(appModule, _options, 'providers'));
    return rule(tree, _context);
  };
}

function addService(_options: Schema, tree: Tree, _context: SchematicContext): Rule{
  return () => {
    if(!tree){
      return
    }
    const path = _options.path ? _options.path : 'src/app'
    const sourceTemplates = url('./templates-services');
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options,
        ...strings
      }),
      move(path),
    ]);  
    return mergeWith(sourceParametrizedTemplates);
  }
}

