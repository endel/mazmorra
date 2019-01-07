require 'json'
require 'psd'

def is_power_of_two(x)
  n = x.to_i
  while (((x % 2) == 0) && x > 1)
    x = x/2
  end
  x == 1 && n != 1
end

file = ARGV[0] || './assets.psd'
psd = PSD.new(file, parse_layer_images: true)
psd.parse!

file_list = []
psd.tree.descendant_layers.each do |layer|
  original = layer.image.to_png

  next if !layer.path.index('ignore').nil? || original.width == 0 || original.height == 0

  filename = "images/sprites/#{layer.path.gsub('/', '-')}.png"
  # power_of_two.save("app/#{filename}")
  original.save("public/#{filename}")
  file_list << filename
end

File.open('client/resource/data.json', 'w+') do |f|
  f.write(file_list.to_json)
end
