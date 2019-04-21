export function flushSessionInStorageSync(res) {
  if (res.header["Set-Cookie"] !== undefined) {
    mpvue.setStorageSync('sessionid', res.header["Set-Cookie"].split(';')[0] + ';');
  }
}

export function getSessionInStorageSync() {
  return mpvue.getStorageSync("sessionid");
}

export function showOKToast(msg) {
  mpvue.showToast({
    title: msg,
    icon: 'success'
  });
}

export function showToast(msg) {
  mpvue.showToast({
    title: msg,
    icon: 'none'
  });
}
