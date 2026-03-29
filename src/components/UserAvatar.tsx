import { getInitials, getAvatarGradient } from '@/lib/avatar'
import Image from 'next/image'

interface UserAvatarProps {
  firstName: string
  lastName?:  string | null
  image?:     string | null
  size?:      number
  className?: string
}

export default function UserAvatar({
  firstName,
  lastName,
  image,
  size = 36,
  className = '',
}: UserAvatarProps) {
  const initials = getInitials(firstName, lastName)
  const [from, to] = getAvatarGradient(firstName)

  if (image) {
    return (
      <Image
        src={image}
        alt={firstName}
        width={size}
        height={size}
        className={className}
        style={{ borderRadius: '50%', objectFit: 'cover', width: size, height: size }}
      />
    )
  }

  return (
    <div
      className={className}
      style={{
        width:          size,
        height:         size,
        borderRadius:   '50%',
        background:     `linear-gradient(135deg, ${from}, ${to})`,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       size * 0.38,
        fontWeight:     600,
        color:          '#fff',
        flexShrink:     0,
        userSelect:     'none',
      }}
    >
      {initials}
    </div>
  )
}