import React, { useContext } from 'react';
import styles from './FileDirectory.module.scss';
import { GlobalContext } from '../../../context/globalReducer';
import { displayFileCode, setFilePath } from '../../../context/globalActions';

const { remote } = window.require('electron');
let fs = remote.require('fs');
const fileImg = require('../../../assets/images/file-document-outline.svg');
const folderImg = require('../../../assets/images/folder-outline.svg');

const FileDirectory = ({ fileTree }) => {
  const [{ componentName }, dispatchToGlobal] = useContext(GlobalContext);

  const handleDisplayFileCode = fileTree => {
    const fileContent = fs.readFileSync(fileTree, 'utf8');
    dispatchToGlobal(displayFileCode(fileContent));
  };

  const convertToHTML = filetree => {
    return filetree.map(file => {
      const desiredComponentName = file.fileName
        .substring(0, file.fileName.indexOf('.') - 1)
        .toLowerCase();
      if (componentName && componentName === desiredComponentName) {
        dispatchToGlobal(setFilePath(file.filePath));
      }
      if (file.fileName !== 'node_modules' && file.fileName !== '.git') {
        if (file.files.length) {
          return (
            <ul key={file.fileName}>
              <li>
                <img id={styles.folder} src={folderImg} alt='folder' />
                <button id={styles.dirButton}>{file.fileName}</button>
              </li>
              {file.files.length && convertToHTML(file.files, fileImg)}
            </ul>
          );
        } else {
          return (
            <ul key={file.filePath}>
              <li>
                <img id={styles.file} src={fileImg} alt='file' />
                <button
                  id={styles.dirButton}
                  onClick={() => {
                    handleDisplayFileCode(file.filePath);
                  }}
                >
                  {file.fileName}
                </button>
              </li>
            </ul>
          );
        }
      }
    });
  };

  return (
    <>
      <div id={styles.fileDirectory}>{fileTree && convertToHTML(fileTree)}</div>
    </>
  );
};

export default FileDirectory;