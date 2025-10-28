import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Facebook,
  YouTube,
  WhatsApp,
  Email,
  Phone,
  Language,
} from '@mui/icons-material';

interface SocialLinksProps {
  variant?: 'horizontal' | 'vertical' | 'grid';
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'default' | 'colorful';
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  variant = 'horizontal',
  showLabels = false,
  size = 'medium',
  color = 'colorful',
}) => {
  const socialData = [
    {
      name: 'Facebook',
      icon: <Facebook />,
      url: 'https://facebook.com',
      color: '#1877f2',
      description: 'Síguenos en Facebook',
    },
    {
      name: 'YouTube',
      icon: <YouTube />,
      url: 'https://youtube.com',
      color: '#ff0000',
      description: 'Videos educativos en YouTube',
    },
    {
      name: 'WhatsApp',
      icon: <WhatsApp />,
      url: 'https://wa.me/50235406163',
      color: '#25d366',
      description: 'Contáctanos por WhatsApp',
    },
    {
      name: 'Email',
      icon: <Email />,
      url: 'mailto:info@edusystem.edu',
      color: '#ea4335',
      description: 'Envíanos un email',
    },
    {
      name: 'Teléfono',
      icon: <Phone />,
      url: 'tel:+1234567890',
      color: '#34a853',
      description: 'Llámanos directamente',
    },
    {
      name: 'Web',
      icon: <Language />,
      url: 'https://edusystem.edu',
      color: '#4285f4',
      description: 'Visita nuestro sitio web',
    },
  ];

  const getSizeProps = () => {
    switch (size) {
      case 'small':
        return { iconSize: 20, buttonSize: 'small' as const, spacing: 1 };
      case 'large':
        return { iconSize: 32, buttonSize: 'large' as const, spacing: 3 };
      default:
        return { iconSize: 24, buttonSize: 'medium' as const, spacing: 2 };
    }
  };

  const { iconSize, buttonSize, spacing } = getSizeProps();

  const handleSocialClick = (url: string, name: string) => {
    // Analytics tracking
    console.log(`Clicked on ${name}: ${url}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderSocialButton = (social: typeof socialData[0], index: number) => (
    <Fade in={true} timeout={600 + index * 100} key={social.name}>
      <Tooltip title={social.description} arrow>
        <IconButton
          size={buttonSize}
          onClick={() => handleSocialClick(social.url, social.name)}
          sx={{
            color: color === 'colorful' ? social.color : 'text.secondary',
            backgroundColor: color === 'colorful' ? `${social.color}15` : 'transparent',
            border: `2px solid ${color === 'colorful' ? social.color : 'transparent'}`,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: color === 'colorful' ? social.color : 'action.hover',
              color: color === 'colorful' ? 'white' : 'primary.main',
              transform: 'translateY(-2px) scale(1.05)',
              boxShadow: `0 8px 24px ${social.color}40`,
            },
          }}
        >
          {React.cloneElement(social.icon, { sx: { fontSize: iconSize } })}
        </IconButton>
      </Tooltip>
    </Fade>
  );

  const renderWithLabel = (social: typeof socialData[0], index: number) => (
    <Fade in={true} timeout={600 + index * 100} key={social.name}>
      <Box
        onClick={() => handleSocialClick(social.url, social.name)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: `${social.color}15`,
            transform: 'translateX(5px)',
          },
        }}
      >
        <IconButton
          size={buttonSize}
          sx={{
            color: social.color,
            backgroundColor: `${social.color}15`,
            '&:hover': {
              backgroundColor: social.color,
              color: 'white',
            },
          }}
        >
          {React.cloneElement(social.icon, { sx: { fontSize: iconSize } })}
        </IconButton>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {social.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {social.description}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );

  if (variant === 'grid') {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 2,
        }}
      >
        {socialData.map((social, index) => renderWithLabel(social, index))}
      </Box>
    );
  }

  if (showLabels) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: variant === 'vertical' ? 'column' : 'row',
          gap: spacing,
          flexWrap: variant === 'horizontal' ? 'wrap' : 'nowrap',
        }}
      >
        {socialData.map((social, index) => renderWithLabel(social, index))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: variant === 'vertical' ? 'column' : 'row',
        gap: spacing,
        flexWrap: variant === 'horizontal' ? 'wrap' : 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {socialData.map((social, index) => renderSocialButton(social, index))}
    </Box>
  );
};

export default SocialLinks;