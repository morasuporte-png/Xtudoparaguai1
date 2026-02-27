import React from 'react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

/**
 * Logo XTUDO Paraguai — container com overflow:hidden recorta o whitespace
 * do PNG, tornando o conteúdo da logo visível e grande como Mercado Livre / Amazon.
 *
 * O PNG 4K (4096×2304) tem ~12% de whitespace no topo e ~25% na base.
 * Renderizamos a imagem a 150px de altura e deixamos apenas 68px visíveis,
 * centralizando no conteúdo real com marginTop negativo.
 */
const Logo: React.FC<LogoProps> = ({ className = '', onClick }) => {
  return (
    <div
      className={`flex-shrink-0 select-none cursor-pointer ${className}`}
      onClick={onClick}
      style={{
        height: '76px',
        width: '220px',
        overflow: 'hidden',
      }}
    >
      <img
        src="/logo.png"
        alt="XTUDO Paraguai"
        draggable={false}
        style={{
          height: '150px',
          width: 'auto',
          marginTop: '-28px',    /* desliza para cima: expõe Paraguai + traço amarelo */
          mixBlendMode: 'multiply',
          imageRendering: 'auto',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default Logo;
