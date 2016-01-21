require 'json'
require 'psd'

def is_power_of_two(x)
  n = x.to_i
  while (((x % 2) == 0) && x > 1)
    x = x/2
  end
  x == 1 && n != 1
end

file = ARGV[0] || './characters.psd'
psd = PSD.new(file, parse_layer_images: true)
psd.parse!

file_list = []
psd.tree.descendant_layers.each do |layer|
  original = layer.image.to_png

  # original_size = [original.width, original.height].max
  # target_size = [original.width, original.height].max
  # while !is_power_of_two(target_size)
  #   target_size = target_size + 1
  # end
  #
  # offset_x = ((target_size.to_f / 2) - (original.width.to_f / 2)).to_i
  # offset_y = ((target_size.to_f / 2) - (original.height.to_f / 2)).to_i
  #
  # power_of_two = ChunkyPNG::Image.new(target_size, target_size, ChunkyPNG::Color::TRANSPARENT)
  # original.pixels.each_with_index do |color, i|
  #   x = offset_x + (i % original.width)
  #   y = offset_y + (i / original.width)
  #   power_of_two.set_pixel(x,y,color)
  # end

  next if original.width == 0 || original.height == 0

  filename = "images/sprites/#{layer.path.gsub('/', '-')}.png"
  # power_of_two.save("app/#{filename}")
  original.save("app/#{filename}")
  file_list << filename
end

File.open('app/js/resource/data.json', 'w+') do |f|
  f.write(file_list.to_json)
end
