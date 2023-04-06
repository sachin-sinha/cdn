
    const containerList = ["822ded20c72849ffb80fa5321b1276a3","fd44bae3e2ee4d3f96649b87664cc3fc"];
    var d = document,
    s = d.getElementsByTagName('script')[0];
    containerList.forEach(container => {
      fetch('https://raw.githubusercontent.com/sachin-sinha/cdn/master/burhan/f2e9a598667f4468991a04057387bfb8/${container}.js')
      .then(response => response.text())
      .then(scriptText => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.text = scriptText;
        s.parentNode.insertBefore(script, s);
      });
    })
  