global = window
global.module = (name) ->
  global[name] = global[name] or {}