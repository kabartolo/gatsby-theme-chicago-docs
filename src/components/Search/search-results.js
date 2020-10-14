/** @jsx jsx */
/* eslint-disable no-unused-vars */
import { jsx, Styled } from 'theme-ui';
import React from 'react';
/* eslint-enable no-unused-vars */
import PropTypes from 'prop-types';
import reactStringReplace from 'react-string-replace';

import ResultLink from './result-link';

import { useTableOfContents, useThemeOptions } from '../../hooks';

import styles from './search.module.scss';

export const EXCERPT_LENGTH = 250;

export default function SearchResults({
  closeDropdown,
  query,
  results,
}) {
  const tableOfContents = useTableOfContents();
  const { primaryResultsOnly } = useThemeOptions();
  const primaryResults = [];
  let otherResults = [];

  function addEllipses(excerpt) {
    if (!excerpt.length) return [];
    const ellipses = (excerpt.join('').length > EXCERPT_LENGTH) && '...';

    return excerpt.concat(ellipses);
  }

  function getExcerpt(text) {
    return text.slice(0, EXCERPT_LENGTH);
  }

  function markText(text, words) {
    return reactStringReplace(text, words, (match, i) => (
      <mark key={i}>{match}</mark>
    ));
  }

  function hasMatch(text, words) {
    return markText(text, words).length > 1;
  }

  function hasSecondaryMatch(markedHeader, paragraphMatch) {
    return markedHeader.length > 1 || (!primaryResultsOnly && paragraphMatch);
  }

  /* Each result is a full post */
  results.forEach((post) => {
    const {
      description,
      headers,
      id,
      path,
      sections,
      title,
    } = post;
    const { flatMap } = tableOfContents.find((node) => node.id === id);
    const markedTitle = markText(title, query);
    const markedDescription = markText(description, query);
    const hasPrimaryResult = markedTitle.length > 1 || markedDescription.length > 1;

    if (hasPrimaryResult) {
      const element = (
        <ResultLink
          excerpt={addEllipses(markedDescription)}
          heading={[]}
          key={id}
          onClick={closeDropdown}
          path={path}
          title={markedTitle}
        />
      );
      primaryResults.push(element);
    }

    const headerMatches = headers.map((header) => {
      const markedHeader = markText(header, query);
      const paragraphs = sections.filter((section) => section.heading === header);
      const paragraphMatch = paragraphs.find((para) => hasMatch(para, query));
      const headerData = flatMap && flatMap.find((data) => data.title === header);
      const slug = headerData ? headerData.url : '';

      return ({
        markedHeader,
        original: header,
        paragraphs,
        paragraphMatch,
        slug,
      });
    }).filter(({ markedHeader, paragraphMatch }) => (
      hasSecondaryMatch(markedHeader, paragraphMatch)
    ));

    headerMatches.forEach((header) => {
      const {
        markedHeader,
        original,
        paragraphs,
        paragraphMatch,
        slug,
      } = header;

      if (original !== '') {
        const excerpt = (!primaryResultsOnly && paragraphMatch)
          ? markText(getExcerpt(paragraphMatch.content), query)
          : '';

        const element = (
          <ResultLink
            excerpt={addEllipses(excerpt)}
            heading={markedHeader.length > 1 ? markedHeader : [original]}
            key={paragraphMatch ? paragraphMatch.id : slug}
            onClick={closeDropdown}
            path={path.replace(/\/$/, slug)}
            title={markedTitle}
          />
        );

        primaryResults.push(element);
      } else if (!primaryResultsOnly && !hasPrimaryResult) {
        const paragraphMatches = paragraphs
          .filter((para) => hasMatch(para.content, query))
          .map((para) => (
            <ResultLink
              excerpt={addEllipses(markText(getExcerpt(para.content), query))}
              heading={[]}
              key={para.id}
              onClick={closeDropdown}
              path={`${path}${slug}`}
              title={markedTitle}
            />
          ));
        otherResults = otherResults.concat(paragraphMatches);
      }
    });
  });

  const newResults = primaryResults.concat(otherResults);

  return (
    <div
      sx={{ variant: 'divs.resultsContainer' }}
      className={`search-results-container ${styles.resultsContainer} ${styles.open}`}
    >
      {!!newResults.length && query.length > 2 && (
        <section
          className={`search-results ${styles.searchResults} ${results.length ? styles.open : ''}`}
        >
          <ol className={`search-results-list ${styles.list}`}>
            {newResults}
          </ol>
        </section>
      )}
    </div>
  );
}

SearchResults.propTypes = {
  closeDropdown: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.instanceOf(Array),
};

SearchResults.defaultProps = {
  closeDropdown: () => null,
  query: '',
  results: [],
};