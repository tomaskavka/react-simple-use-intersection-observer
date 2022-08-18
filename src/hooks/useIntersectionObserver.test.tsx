import { act, renderHook } from '@testing-library/react';
import useIntersectionObserver from './useIntersectionObserver';

const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();
const mockIntersectionObserver = jest.fn().mockReturnValue({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
});

describe('useIntersectionObserver', () => {
  describe('IntersectionObserver is un supported', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeAll(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockReturnValue();
    });

    afterAll(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should handle error', () => {
      const ref = {
        current: {} as HTMLElement,
      };

      const { result, unmount } = renderHook(() => useIntersectionObserver(ref));

      unmount();

      expect(consoleErrorSpy).toHaveBeenCalledWith('IntersectionObserver is not supported in this browser');
    });
  });

  describe('IntersectionObserver is supported', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'IntersectionObserver', {
        value: mockIntersectionObserver,
      });
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should setUp observer', () => {
      const ref = {
        current: {} as HTMLElement,
      };

      const { result } = renderHook(() => useIntersectionObserver(ref));

      expect(mockObserve).toHaveBeenCalledWith(ref.current);
      expect(result.current.isInViewport).toBeFalsy();
      expect(result.current.entry).toBeNull();
    });

    it('should set isInViewport truthy when element intersects viewport', () => {
      const ref = {
        current: {} as HTMLElement,
      };

      const { result } = renderHook(() => useIntersectionObserver(ref, {}));

      const mockIntersectionObserverCallback = mockIntersectionObserver.mock.calls[0][0];

      act(() => {
        mockIntersectionObserverCallback([{ target: ref.current, isIntersecting: true }]);
      });

      expect(result.current.isInViewport).toBeTruthy();
      expect(result.current.entry?.isIntersecting).toBeTruthy();
      expect(result.current.entry?.target).toBe(ref.current);
      expect(mockUnobserve).toHaveBeenCalledWith(ref.current);
    });

    it('should keep tracking even though element intersected viewport', () => {
      const ref = {
        current: {} as HTMLElement,
      };

      const { result } = renderHook(() => useIntersectionObserver(ref, { keepTracking: true }));

      const mockIntersectionObserverCallback = mockIntersectionObserver.mock.calls[0][0];

      act(() => {
        mockIntersectionObserverCallback([{ target: ref.current, isIntersecting: true }]);
      });

      expect(result.current.isInViewport).toBeTruthy();
      expect(result.current.entry?.isIntersecting).toBeTruthy();
      expect(result.current.entry?.target).toBe(ref.current);

      act(() => {
        mockIntersectionObserverCallback([{ target: ref.current, isIntersecting: false }]);
      });

      expect(result.current.isInViewport).toBeFalsy();
      expect(result.current.entry?.isIntersecting).toBeFalsy();
      expect(result.current.entry?.target).toBe(ref.current);
    });

    it('should disconnect observer on unmount', () => {
      const ref = {
        current: {} as HTMLElement,
      };

      const { unmount } = renderHook(() => useIntersectionObserver(ref, { keepTracking: true }));

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });
});
