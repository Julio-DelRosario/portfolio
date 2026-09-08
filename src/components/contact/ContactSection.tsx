"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { PageContainer } from "@/components/layout/page-container";
import { CONTACT_DATA } from "@/data/contact";
import { buttonVariants } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./../ui/icons";
import { cn } from "@/lib/utils";

const STAGGER_MS = 100;
const DURATION_S = 0.5;
const EASE = [0.25, 0.1, 0.25, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (customDelay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_S,
      ease: EASE,
      delay: customDelay / 1000,
    },
  }),
};

function getIcon(name: string) {
  switch (name.toLowerCase()) {
    case "github": return <GithubIcon className="contact__icon" aria-hidden="true" />;
    case "linkedin": return <LinkedinIcon className="contact__icon" aria-hidden="true" />;
    default: return null;
  }
}

export function ContactSection() {
  return (
    <section id="contact" className="contact site-section" aria-labelledby="contact-heading">
      <div className="contact__bg-accent" aria-hidden="true" />
      
      <PageContainer>
        <div className="contact__grid">
          <motion.div
            className="contact__header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={fadeUp}
            custom={0}
          >
            <h2 id="contact-heading" className="site-section__eyebrow">
              CONTACT
            </h2>
          </motion.div>

          <div className="contact__content-area">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUp}
              custom={STAGGER_MS}
              className="contact__intro-block"
            >
              <p className="contact__statement">{CONTACT_DATA.heading}</p>
              <p className="contact__description">{CONTACT_DATA.description}</p>
            </motion.div>

            <motion.div 
              className="contact__actions"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUp}
              custom={STAGGER_MS * 2}
            >
              <a 
                href={`mailto:${CONTACT_DATA.email}`}
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "contact__primary-btn")}
              >
                <Mail className="contact__icon" aria-hidden="true" />
                <span>Email me</span>
              </a>

              <div className="contact__secondary-actions">
                {CONTACT_DATA.socials.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "contact__secondary-btn")}
                    aria-label={`Visit my ${social.platform} profile`}
                  >
                    {getIcon(social.icon)}
                    <span>{social.platform}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
