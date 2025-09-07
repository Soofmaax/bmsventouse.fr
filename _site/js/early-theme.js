(function(){
  try{
    var k='bms-theme-preference';
    var s=localStorage.getItem(k);
    var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark=s?s==='dark':m;
    if(dark){
      document.documentElement.classList.add('dark-theme');
      document.body&&document.body.classList&&document.body.classList.add('dark-theme');
    }
  }catch(e){ void e; }
})();