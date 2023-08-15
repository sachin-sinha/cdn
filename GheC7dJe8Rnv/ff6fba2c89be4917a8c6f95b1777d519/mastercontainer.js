
  const containerList = ["a31fd887d6914d6a9f70b5046ca2a916"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/GheC7dJe8Rnv/ff6fba2c89be4917a8c6f95b1777d519/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
