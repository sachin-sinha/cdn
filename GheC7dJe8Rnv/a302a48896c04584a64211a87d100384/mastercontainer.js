
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","218dd682e8a448bc8250c3c021dd886b"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/GheC7dJe8Rnv/a302a48896c04584a64211a87d100384/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
