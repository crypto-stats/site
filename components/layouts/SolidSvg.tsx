interface SolidSvgProps {
  width: string
  height: string
  path: string
  color?: string
  fit?: boolean
}

export const SolidSvg = ({ width, height, path, color = 'black', fit = false }: SolidSvgProps) => {
  return (
    <div>
      <style jsx>{`
        div {
          width: ${width};
          height: ${height};
          background-color: ${color};
          mask: url(${path});
          mask-repeat: no-repeat;
          mask-position: center;
          mask-size: ${fit ? 'contain' : 'auto'};
        }
      `}</style>
    </div>
  )
}
