
  const containerList = ["edc6c2927350460aa6e1dcd685925b64"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/KpG4GoZiM6Py/cece7d87ec9b4a5e939457962cc966f0/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
