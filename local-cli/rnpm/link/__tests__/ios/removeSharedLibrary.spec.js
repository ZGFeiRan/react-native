'use strict';

jest.autoMockOff();

const xcode = require('xcode');
const path = require('path');
const addSharedLibraries = require('../../src/ios/addSharedLibraries');
const removeSharedLibraries = require('../../src/ios/removeSharedLibraries');
const getGroup = require('../../src/ios/getGroup');

const project = xcode.project(
  path.join(__dirname, '../../__fixtures__/project.pbxproj')
);

describe('ios::removeSharedLibraries', () => {

  beforeEach(() => {
    project.parseSync();
    addSharedLibraries(project, ['libc++.tbd', 'libz.tbd']);
  });

  it('should remove only the specified shared library', () => {
    removeSharedLibraries(project, ['libc++.tbd']);

    const frameworksGroup = getGroup(project, 'Frameworks');
    expect(frameworksGroup.children.length).toEqual(1);
    expect(frameworksGroup.children[0].comment).toEqual('libz.tbd');
  });

  it('should ignore missing shared libraries', () => {
    removeSharedLibraries(project, ['libxml2.tbd']);

    const frameworksGroup = getGroup(project, 'Frameworks');
    expect(frameworksGroup.children.length).toEqual(2);
  });

});
