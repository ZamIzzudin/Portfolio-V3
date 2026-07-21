<script setup lang="ts">

const sections = [
  { name: 'Home Intro', tag: '#section-hero', usage: 'Display the intro section on homepage' },
  { name: 'Addons', tag: '#section-addons', usage: 'Display a grid of add-ons or resources.' },
  { name: 'Blocks', tag: '#section-blocks', usage: 'Show a grid of blocks (e.g., products, features).' },
  { name: 'Blocks Vertical', tag: '#section-blocks-vertical', usage: 'Show blocks in a vertical layout.' },
  { name: 'Showcases', tag: '#section-showcases', usage: 'Highlight showcase items or projects.' },
  { name: 'Testimonials', tag: '#section-testimonials', usage: 'Display testimonials from users or clients.' },
  { name: 'Experiences', tag: '#section-experiences', usage: 'List work experiences or milestones.' },
  { name: 'Static Banner', tag: '#section-static-banner', usage: 'Show a static banner section.' },
  { name: 'Static Text', tag: '#section-static-text', usage: 'Display a static text section.' },
  { name: 'Custom Posts', tag: '#section-custom-posts', usage: 'Show a row of specific posts by tag.' },
  { name: 'Now', tag: '#section-now', usage: "Display the latest 'Now' post." },
  { name: 'Custom Content', tag: '#section-custom-content', usage: 'Add any custom content from a page' },
  { name: 'Events', tag: '#section-events', usage: 'List events or event cards.' },
  { name: 'Logos', tag: '#section-logos', usage: 'Display a logo wall or list of logos.' },
]
</script>

<template>
  <div>

    <section class="section-space">
      <div class="container-page">
        <p class="mt-[2.8rem] max-w-[52rem] text-[1.75rem] leading-[1.65] text-secondary m-0">
          Naoto is a clean, minimal and flexible Ghost theme designed to showcase
          your portfolio and writings. It is tailor-made for designers, developers,
          makers, solopreneurs, content creators and people who want to build their
          personal website with Ghost CMS.
        </p>

        <blockquote class="quote-block mt-[5.6rem]">
          “Naoto feels more clean, a bit more modern, more visual too (post
          thumbnails, icons, series etc. make it more than just text while keeping
          it very minimal) not too much branding to it, a lot of possible sections.
          Exactly what I was looking for for a while now!”
          <footer>— James Mitchell, Startup Founder</footer>
        </blockquote>
      </div>

      <div class="container-wide mt-[7.2rem]">
        <h2 class="section-label mb-[2.8rem] m-0">Sections</h2>
        <div class="about-table-wrap">
          <table class="about-table">
            <thead>
              <tr>
                <th>Section Name</th>
                <th>Tag to Use</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in sections" :key="s.name">
                <td>{{ s.name }}</td>
                <td><code>{{ s.tag }}</code></td>
                <td>{{ s.usage }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>
