/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react';

function useActiveId(itemIds, postId) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, { rootMargin: '0% 0% -80% 0%' });

    itemIds.forEach((id) => {
      observer.observe(document.getElementById(id));
    });

    return () => {
      itemIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [postId]);

  return activeId;
}

export { useActiveId };
