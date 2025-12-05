let toasts = [];
const showToast = (options) => {
  return 0;
};
const success = (title, message = "", options = {}) => {
  return showToast({
    ...options
  });
};
const error = (title, message = "", options = {}) => {
  return showToast({
    // خطاها بیشتر نمایش داده شوند
    ...options
  });
};
const info = (title, message = "", options = {}) => {
  return showToast({
    ...options
  });
};
const warning = (title, message = "", options = {}) => {
  return showToast({
    ...options
  });
};
const closeToast = (id) => {
  return;
};
const clearAll = () => {
  return;
};
const useToast = () => {
  return {
    // متدهای اصلی
    show: showToast,
    success,
    error,
    info,
    warning,
    // متدهای مدیریت
    close: closeToast,
    clearAll,
    // state - برگردان آرایه ساده به جای ref
    toasts: () => [...toasts]
  };
};

export { useToast as u };
//# sourceMappingURL=useToast-D_iChEHW.mjs.map
