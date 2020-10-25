/* eslint-disable react/jsx-props-no-spreading */
/** @jsx jsx */
import { jsx, Styled } from 'theme-ui';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import ExternalLink from './ExternalLink';

/* Uses the ExternalLink component for external links,
   Gatsby's Link component for links to other pages within the site,
   and a regular <a> tag for fragment links.
   Used for <a> tags in MDX files.
*/
export default function FlexibleLink({ children, href, ...props }) {
  // External link
  if (href.match(/^http/)) {
    return (
      <ExternalLink
        href={href}
        {...props}
      >
        {children}
      </ExternalLink>
    );
  }

  // Fragment link (to location on current page) or internal link (to location within site)
  return href.slice(0, 1) === '#'
    ? (
      <Styled.a
        href={href}
        {...props}
      >
        {children}
      </Styled.a>
    ) : (
      <Styled.a
        as={Link}
        to={href}
        {...props}
      >
        {children}
      </Styled.a>
    );
}

FlexibleLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  href: PropTypes.string.isRequired,
};
