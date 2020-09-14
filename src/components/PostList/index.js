/** @jsx jsx */
import { jsx, Styled } from 'theme-ui';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import { Link } from 'gatsby';

import styles from './postlist.module.scss';

import { useLocation, usePostContext } from '../../hooks';

/* Returns a list of posts for the current menu or group */
export default function PostList() {
  const { menu } = usePostContext();
  const location = useLocation();

  const isMenuIndex = menu.path === location.pathname;
  const groupIndex = menu.items && menu.items.find((item) => item.path === location.pathname);
  const currentMenu = isMenuIndex ? menu : groupIndex;

  if (!currentMenu) return null;

  return (
    <ul className={styles.postList}>
      {currentMenu.items.map((post) => (
        <li key={post.id} sx={{ variant: 'lis.postList' }}>
          <Styled.a
            as={Link}
            to={post.path}
            sx={{ variant: 'links.postList' }}
          >
            {post.title || post.name}
          </Styled.a>
        </li>
      ))}
    </ul>
  );
}