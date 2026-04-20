import type { Config } from "tailwindcss";

export default {
        darkMode: ["class"],
        content: [
                "./client/index.html",
                "./client/src/**/*.{ts,tsx}",
        ],
        prefix: "",
        theme: {
                container: {
                        center: true,
                        padding: '2rem',
                        screens: {
                                '2xl': '1400px'
                        }
                },
                extend: {
                        colors: {
                                border: 'hsl(var(--border))',
                                input: 'hsl(var(--input))',
                                ring: 'hsl(var(--ring))',
                                background: 'hsl(var(--background))',
                                foreground: 'hsl(var(--foreground))',
                                primary: {
                                        DEFAULT: 'hsl(var(--primary))',
                                        foreground: 'hsl(var(--primary-foreground))',
                                        light: 'hsl(var(--primary-light))'
                                },
                                secondary: {
                                        DEFAULT: 'hsl(var(--secondary))',
                                        foreground: 'hsl(var(--secondary-foreground))'
                                },
                                destructive: {
                                        DEFAULT: 'hsl(var(--destructive))',
                                        foreground: 'hsl(var(--destructive-foreground))'
                                },
                                muted: {
                                        DEFAULT: 'hsl(var(--muted))',
                                        foreground: 'hsl(var(--muted-foreground))'
                                },
                                accent: {
                                        DEFAULT: 'hsl(var(--accent))',
                                        foreground: 'hsl(var(--accent-foreground))'
                                },
                                success: {
                                        DEFAULT: 'hsl(var(--success))',
                                        foreground: 'hsl(var(--success-foreground))'
                                },
                                popover: {
                                        DEFAULT: 'hsl(var(--popover))',
                                        foreground: 'hsl(var(--popover-foreground))'
                                },
                                card: {
                                        DEFAULT: 'hsl(var(--card))',
                                        foreground: 'hsl(var(--card-foreground))'
                                },
                                sidebar: {
                                        DEFAULT: 'hsl(var(--sidebar-background))',
                                        foreground: 'hsl(var(--sidebar-foreground))',
                                        primary: 'hsl(var(--sidebar-primary))',
                                        'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                                        accent: 'hsl(var(--sidebar-accent))',
                                        'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                                        border: 'hsl(var(--sidebar-border))',
                                        ring: 'hsl(var(--sidebar-ring))'
                                }
                        },
                        borderRadius: {
                                lg: 'var(--radius)',
                                md: 'calc(var(--radius) - 2px)',
                                sm: 'calc(var(--radius) - 4px)'
                        },
                        backgroundImage: {
                                'gradient-ocean': 'var(--gradient-ocean)',
                                'gradient-sunset': 'var(--gradient-sunset)',
                                'gradient-hero': 'var(--gradient-hero)',
                                'gradient-marine': 'var(--gradient-marine)',
                                'gradient-coral-reef': 'var(--gradient-coral-reef)',
                                'gradient-deep-sea': 'var(--gradient-deep-sea)',
                                'gradient-logo': 'var(--gradient-logo)'
                        },
                        boxShadow: {
                                'ocean': 'var(--shadow-ocean)',
                                'soft': 'var(--shadow-soft)',
                                'coral': 'var(--shadow-coral)',
                                'blue': 'var(--shadow-blue)'
                        },
                        transitionTimingFunction: {
                                'smooth': 'var(--transition-smooth)',
                                'wave': 'var(--transition-wave)'
                        },
                        borderWidth: {
                                'marine': 'var(--border-marine)',
                                'coral': 'var(--border-coral)',
                                'blue': 'var(--border-blue)'
                        },
                        keyframes: {
                                'accordion-down': {
                                        from: {
                                                height: '0'
                                        },
                                        to: {
                                                height: 'var(--radix-accordion-content-height)'
                                        }
                                },
                                'accordion-up': {
                                        from: {
                                                height: 'var(--radix-accordion-content-height)'
                                        },
                                        to: {
                                                height: '0'
                                        }
                                },
                                'float': {
                                        '0%, 100%': { transform: 'translateY(0px)' },
                                        '50%': { transform: 'translateY(-10px)' }
                                },
                                'wave': {
                                        '0%, 100%': { transform: 'rotate(0deg)' },
                                        '25%': { transform: 'rotate(3deg)' },
                                        '75%': { transform: 'rotate(-3deg)' }
                                }
                        },
                        animation: {
                                'accordion-down': 'accordion-down 0.2s ease-out',
                                'accordion-up': 'accordion-up 0.2s ease-out',
                                'float': 'float 3s ease-in-out infinite',
                                'wave': 'wave 2s ease-in-out infinite'
                        }
                }
        },
        plugins: [require("tailwindcss-animate")],
} satisfies Config;
