import {chain, Rule, SchematicContext, Tree, apply, mergeWith, template, url, move,branchAndMerge, SchematicsException } from '@angular-devkit/schematics';
import {
  NodePackageInstallTask,
  RunSchematicTask,
} from '@angular-devkit/schematics/tasks';
import { strings, join, Path } from '@angular-devkit/core'
import { getWorkspace } from "@schematics/angular/utility/config";
import { getPackageJson } from './common/utils';

import { Schema } from './schema';
import { addDeclarationToAppModule } from './declaration/add-declaration-to-module.rule';
import { parseName } from "@schematics/angular/utility/parse-name"
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
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
   if(!_options.withModule){
    console.log({withModule:_options.withModule})
    return chain([
      starterComponent(_options,tree,_context),
      moduleAddComponent(_options,tree,_context),
      addService(_options,tree,_context),
      moduleAddService(_options,tree,_context)
    ])(tree, _context);
   }else{
     console.log({withModule:_options.withModule})
     return chain([
      starterComponentWithModule(_options,tree,_context),
      withModuleAddModule(_options,tree,_context),
      addService(_options,tree,_context),
      moduleAddService(_options,tree,_context)
    ])(tree, _context);
   }
    
  };
}
export function addTailwind(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read("angular.json");
    if(!workspaceConfigBuffer){
      throw new SchematicsException('Not an Angular CLI workspace');
    }
    const workspace = getWorkspace(tree);
    const packageJson = getPackageJson(tree);
    const projectName = _options.project || workspace.defaultProject;

    const coreVersion: string = packageJson.dependencies['@angular/core'];

    if (!coreVersion) {
      throw new SchematicsException(
        'Could not find @angular/core version in package.json.',
      );
    }

    const majorVersion: number = parseInt(
      coreVersion.split('.')[0].replace(/\D/g, ''),
      10,
    );

    if (majorVersion < 8) {
      throw new SchematicsException('Minimum version requirement not met.');
    }

   // 2. run schematic that chain a set of schematics that will add and update files
    const setupId = _context.addTask(
      new RunSchematicTask('ng-add-setup', { project: projectName }),
    );

   // 3. Install dependencies (or skip installation)
    if(!_options.skipInstall){
      _context.addTask(new NodePackageInstallTask(), [setupId]);
    }
    
    console.log('addTailwind')
  }
  
}
export function generateSharedService(_options: Schema): Rule {
   /* tslint:disable:no-unused-variable */
  return (tree: Tree, _context: SchematicContext) => {
   /*  console.log({tree})
    console.log({_context}) */
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
    
    return chain([
      starterService(_options,tree,_context),
      moduleAddService(_options,tree,_context)
    ])(tree, _context);
  }
}

export function generateModel(_options: Schema): Rule {
  /* tslint:disable:no-unused-variable */
 return (tree: Tree, _context: SchematicContext) => {
  /*  console.log({tree})
   console.log({_context}) */
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
   
   return chain([
     starterModel(_options,tree,_context),
   ])(tree, _context);
 }
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

function starterComponentWithModule(_options: Schema, tree: Tree, _context: SchematicContext): Rule {
  return () => {
    if(!tree){
      return
    }
    const path = _options.path ? _options.path : 'src/app'
    const sourceTemplates = url('./templates-with-module');  
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

function withModuleAddModule(_options: Schema,tree: Tree, _context: SchematicContext): Rule {
  console.log({_options})
  return () => {
    const appModule = _options.module ? _options.module : 'src/app/app.module.ts';
    const rule = branchAndMerge(addDeclarationToAppModule(appModule, _options, 'imports'));
    return rule(tree, _context);
  };
}
function withModuleAddService(_options: Schema,tree: Tree, _context: SchematicContext): Rule {
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
    const path = _options.path ? _options.path : 'src/app/'
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

function starterService(_options: Schema, tree: Tree, _context: SchematicContext): Rule{
  return () => {
    if(!tree){
      return
    }
    const path = _options.path ? _options.path : 'src/app/services/'
    const sourceTemplates = url('./templates-sharing-service');
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options,
        ...strings,
        typeSelector
      }),
      move(path),
    ]);  
    
    return mergeWith(sourceParametrizedTemplates);
  }
}

function starterModel(_options: Schema, tree: Tree, _context: SchematicContext): Rule{
  return () => {
    if(!tree){
      return
    }
    console.log(_options.properties)
    let props:any = [];
    _options.properties?.split(',').map( o =>{
      //console.log(o.split('/'));
      props.push({n:o.split('/')[0].trim(),t:o.split('/')[1].trim()})
    })
    _options.props = props
    const path = _options.path ? _options.path : 'src/app/models/'
    const sourceTemplates = url('./templates-models');
    console.log(_options)
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

function typeSelector(value: string): any {
 return value === 'string'? "new BehaviorSubject('first value')" : (value === 'boolean' ? "new BehaviorSubject(false)" : "new Subject<any>()" )
}