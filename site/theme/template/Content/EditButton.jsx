import React from 'react';
import { Tooltip, Icon } from 'antd';

export default function EditButton({
  title,
  filename,
  sourcePath = 'https://github.com/ThomasLiu/u_web_site/edit/master/',
}) {
  return (
    <Tooltip title={title}>
      <a className="edit-button" target="_blank" href={`${sourcePath}${filename}`}>
        <Icon type="edit" />
      </a>
    </Tooltip>
  );
}
