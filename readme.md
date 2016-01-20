# gititude

add latitude and longitude to your git commits

if you use `gititude commit` instead of `git commit` then you will get get git tags automatically added to your commits that contain your latest latitude and longitude

## install

```
npm i gititude -g
```

## usage

```
gititude

  set    (--lat --lon --date)     manually add a new location to the log
  update                          try to set new latest location automatically
  list                            list all logged locations (stored in ~/.config)
  latest                          get latest location
```

you have to run either `gititude set` or `gititude update` to update your latest location

on Mac you can use the [Monu](https://github.com/maxogden/monu) application and the [`run-every`](https://npmjs.org) module to do this in the background: `run-every 600 bash -c "gititude update || true"`

then you can use `gititude commit` and it will automatically tag your commit with your latest location using git tags
