Jekyll::Hooks.register :documents, :post_render do |doc|
  doc.output = doc.output.gsub(/<img(?![^>]*\bloading=)/, '<img loading="lazy"')
end
