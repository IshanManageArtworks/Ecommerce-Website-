import { useEffect, useRef } from "react";

function useIntersectionObserver(targetRef, callback, options = {}) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const target = targetRef?.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        savedCallback.current();
      }
    }, options);

    observer.observe(target);

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [targetRef, options]);
}

export default useIntersectionObserver;
