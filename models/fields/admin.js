exports.headers = function (type) {
  if (type == 'settings') { return 'Settings'; } else
  if (type == 'content') { return 'Content'; } else
  if (type == 'media-buffet') { return 'Media Buffet'; } else
  if (type == 'resources') { return 'Resources'; } else
  { return 'HEADER NOT FOUND'; }
};
