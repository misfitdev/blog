module Jekyll
  class TagPageGenerator < Generator
    safe true

    def generate(site)
      site.categories.each do |category, posts|
        site.pages << TagPage.new(site, site.source, category)
      end
    end
  end

  class TagPage < Page
    def initialize(site, base, category)
      @site = site
      @base = base
      @dir = "tags"
      @name = "#{category.gsub(/\s+/, '-').downcase}.html"

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag.html')
      self.data['tag'] = category
      self.data['title'] = "Posts in \"#{category}\""
    end
  end
end