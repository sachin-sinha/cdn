
  const containerList = ["fed95702dbdc4f81ad0d54a061260957"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/KpG4GoZiM6Py/97071fd8ec944a18866ae7810e4ffb6f/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
