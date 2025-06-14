import React from 'react';
import { Icon } from '@iconify/react';
import { useDocumentTitle, useSocialMeta, useStructuredData, generatePersonStructuredData } from '../utils/seo';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { aboutData } from '../data/aboutData';

export const About: React.FC = () => {
  const { settings } = useSiteSettings();

  // SEO: Set page title and meta description
  useDocumentTitle(
    'About',
    'Learn about Ericsson Budhilaw, a seasoned full-stack software engineer with 6+ years of experience in React, Go, Rust, and cloud solutions. Based in Indonesia, specializing in modern web development.'
  );

  // SEO: Set social media meta tags
  useSocialMeta({
    title: 'About Ericsson Budhilaw',
    description: 'Learn about Ericsson Budhilaw, a seasoned full-stack software engineer with 6+ years of experience in React, Go, Rust, and cloud solutions.',
    type: 'website'
  });

  // SEO: Add structured data for person
  useStructuredData(
    generatePersonStructuredData({
      name: 'Ericsson Budhilaw',
      jobTitle: 'Senior Software Engineer',
      description: 'Seasoned full-stack software engineer with 6+ years of experience delivering high-performance solutions using React, Go, Rust, and cloud technologies.',
      url: `${window.location.origin}/about`,
      image: settings?.site.photo_profile,
      sameAs: [
        settings?.site.social_media_links.github,
        settings?.site.social_media_links.linkedin,
        settings?.site.social_media_links.x,
      ].filter(Boolean) as string[]
    })
  );

  // Update the position title to "Senior Software Engineer"
  const workHistoryWithUpdatedTitle = aboutData.workHistory.map(job => 
    job.id === 'paper-id' 
      ? { ...job, position: 'Senior Software Engineer' }
      : job
  );

  return (
    <div className="min-h-screen w-full bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-5xl mb-4">
              About Me
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-[rgb(var(--color-muted-foreground))]">
              {aboutData.personalInfo.tagline}
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            {/* Personal Story */}
            <div>
              <h2 className="text-3xl font-bold text-[rgb(var(--color-foreground))] mb-6">
                My Story
              </h2>
              <div className="prose prose-lg text-[rgb(var(--color-muted-foreground))] space-y-4">
                {aboutData.personalInfo.bio.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
              </div>

              {/* Core Values */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-[rgb(var(--color-foreground))] mb-4">
                  Core Values & Philosophy
                </h3>
                <div className="space-y-3">
                  {aboutData.coreValues.map((value, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-[rgb(var(--color-accent))] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[rgb(var(--color-muted-foreground))]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Work History Timeline */}
            <div>
              <h2 className="text-3xl font-bold text-[rgb(var(--color-foreground))] mb-6">
                Professional Experience
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-[rgb(var(--color-border))]"></div>
                
                <div className="space-y-8">
                  {workHistoryWithUpdatedTitle
                    .sort((a, b) => a.order - b.order)
                    .map((job, index) => (
                    <div key={job.id} className="relative">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 relative z-10">
                          <div className="flex items-center justify-center w-8 h-8 bg-[rgb(var(--color-primary))] rounded-full border-2 border-[rgb(var(--color-background))]">
                            <Icon 
                              icon={job.current ? "lucide:briefcase" : "lucide:calendar"} 
                              className="w-4 h-4 text-white" 
                            />
                          </div>
                          {job.current && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[rgb(var(--color-background))]"></div>
                          )}
                        </div>
                        <div className="ml-6 flex-1">
                          <div className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))] shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-lg font-semibold text-[rgb(var(--color-foreground))]">
                                  {job.position}
                                </h4>
                                <p className="text-[rgb(var(--color-primary))] font-medium">{job.company}</p>
                              </div>
                              {job.current && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[rgb(var(--color-muted-foreground))] mb-4 flex items-center">
                              <Icon icon="lucide:calendar" className="w-4 h-4 mr-1" />
                              {job.period}
                            </p>
                            
                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">Key Achievements:</h5>
                              <ul className="space-y-2">
                                {job.achievements.map((achievement, idx) => (
                                  <li key={idx} className="text-sm text-[rgb(var(--color-muted-foreground))] flex items-start">
                                    <span className="w-1.5 h-1.5 bg-[rgb(var(--color-accent))] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">Technologies:</h5>
                              <div className="flex flex-wrap gap-2">
                                {job.technologies.map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 text-xs bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] rounded border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-primary))] hover:text-white transition-colors"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Expertise */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-[rgb(var(--color-foreground))] mb-8 text-center">
              Technical Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutData.skills
                .sort((a, b) => a.order - b.order)
                .map((skillCategory) => (
                <div
                  key={skillCategory.id}
                  className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))] hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-[rgb(var(--color-foreground))] mb-3 flex items-center">
                    <Icon icon="lucide:code" className="w-5 h-5 mr-2 text-[rgb(var(--color-primary))]" />
                    {skillCategory.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] text-sm rounded-full border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-primary))] hover:text-white transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education */}
            <div className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
              <div className="flex items-center mb-4">
                <Icon icon="lucide:graduation-cap" className="w-6 h-6 text-[rgb(var(--color-primary))] mr-3" />
                <h3 className="text-xl font-semibold text-[rgb(var(--color-foreground))]">Education</h3>
              </div>
              <div className="space-y-4">
                {aboutData.education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-medium text-[rgb(var(--color-foreground))]">{edu.degree}</p>
                    <p className="text-[rgb(var(--color-primary))] font-medium">{edu.institution}</p>
                    <p className="text-sm text-[rgb(var(--color-muted-foreground))] mb-2">{edu.period}</p>
                    {edu.description && (
                      <p className="text-sm text-[rgb(var(--color-muted-foreground))]">{edu.description}</p>
                    )}
                    {edu.gpa && (
                      <p className="text-sm text-[rgb(var(--color-muted-foreground))]">GPA: {edu.gpa}</p>
                    )}
                    {edu.honors && edu.honors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-[rgb(var(--color-foreground))]">Honors:</p>
                        <ul className="text-sm text-[rgb(var(--color-muted-foreground))]">
                          {edu.honors.map((honor, index) => (
                            <li key={index} className="flex items-center">
                              <Icon icon="lucide:award" className="w-3 h-3 mr-1 text-[rgb(var(--color-accent))]" />
                              {honor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
              <div className="flex items-center mb-4">
                <Icon icon="lucide:award" className="w-6 h-6 text-[rgb(var(--color-primary))] mr-3" />
                <h3 className="text-xl font-semibold text-[rgb(var(--color-foreground))]">Certifications</h3>
              </div>
              <div className="space-y-4">
                {aboutData.certifications.map((cert) => (
                  <div key={cert.id} className="border-b border-[rgb(var(--color-border))] last:border-b-0 pb-3 last:pb-0">
                    <p className="font-medium text-[rgb(var(--color-foreground))]">{cert.title}</p>
                    <p className="text-[rgb(var(--color-primary))] font-medium">{cert.issuer}</p>
                    <p className="text-sm text-[rgb(var(--color-muted-foreground))]">
                      Issued: {new Date(cert.date).toLocaleDateString()}
                      {cert.expiryDate && ` • Expires: ${new Date(cert.expiryDate).toLocaleDateString()}`}
                    </p>
                    {cert.credentialId && (
                      <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                        ID: {cert.credentialId}
                      </p>
                    )}
                    {cert.url && (
                      <a 
                        href={cert.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[rgb(var(--color-primary))] hover:underline inline-flex items-center mt-1"
                      >
                        View Certificate
                        <Icon icon="lucide:external-link" className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <div className="bg-[rgb(var(--color-muted))] rounded-lg p-8 border border-[rgb(var(--color-border))]">
              <h3 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-4">
                Let's Work Together
              </h3>
              <p className="text-[rgb(var(--color-muted-foreground))] mb-6 max-w-2xl mx-auto">
                I'm always excited to take on new challenges and create innovative solutions. 
                Whether you need a full-stack application, consulting, or technical leadership, let's discuss how I can help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
                >
                  <Icon icon="lucide:mail" className="w-4 h-4 mr-2" />
                  Start a Project
                </a>
                <a
                  href={`mailto:${aboutData.personalInfo.email}`}
                  className="inline-flex items-center justify-center px-8 py-3 border border-[rgb(var(--color-border))] text-base font-medium rounded-md text-[rgb(var(--color-foreground))] bg-transparent hover:bg-[rgb(var(--color-background))] transition-colors duration-200"
                >
                  <Icon icon="lucide:send" className="w-4 h-4 mr-2" />
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 