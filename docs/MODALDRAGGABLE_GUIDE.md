# Guide ModalDraggable

## Composant réutilisable Modal avec dragging optionnel

### Import

```tsx
import { ModalDraggable } from '@/components/ui/ModalDraggable';
```

### Usage simple

```tsx
import { useState } from 'react';
import { ModalDraggable } from '@/components/ui/ModalDraggable';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Ouvrir Modal</button>
      
      <ModalDraggable
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Mon Modal"
        draggable={true}
        maxWidth="max-w-lg"
      >
        <p>Contenu du modal</p>
      </ModalDraggable>
    </>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Contrôle si le modal est visible |
| `onClose` | `() => void` | - | Callback appelé au clic sur Close ou backdrop |
| `title` | `string` | undefined | Titre optionnel du modal (affiché dans l'header) |
| `children` | `React.ReactNode` | undefined | Contenu du modal |
| `draggable` | `boolean` | `true` | Si true, l'header permet de traîner le modal |
| `maxWidth` | `string` | `max-w-lg` | Classe Tailwind pour la largeur max (ex: `max-w-xl`, `max-w-2xl`) |

### Avantages

✅ **Sans double-wrapping** : Composant léger et direct, pas de nesting inutile  
✅ **Draggable par défaut** : Interaction utilisateur améliorée  
✅ **Portal rendering** : S'affiche toujours au-dessus du contenu  
✅ **Responsive** : Adapté mobile et desktop avec `w-[min(96%,100%)]`  
✅ **Animations Framer Motion** : Smooth enter/exit transitions  
✅ **Hauteur limitée** : `max-h-[85vh]` avec `overflow:hidden` (pas de scrollbars)  

### Exemples d'usage

#### Auth Card (formulaire login/signup draggable)
```tsx
<ModalDraggable
  isOpen={isOpen}
  onClose={() => window.history.back()}
  title="Auth - SaaS Manager"
  maxWidth="max-w-md"
>
  <AuthCardContent />
</ModalDraggable>
```

#### Modal sans dragging
```tsx
<ModalDraggable
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmation"
  draggable={false}
>
  <p>Êtes-vous sûr ?</p>
</ModalDraggable>
```

#### Modal sans titre (header caché)
```tsx
<ModalDraggable
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
>
  <div>Contenu custom sans header</div>
</ModalDraggable>
```

### Differences avec DraggableModal

| Aspect | ModalDraggable | DraggableModal |
|--------|----------------|----------------|
| **Wrapping** | Direct, léger | Peut causer double-nesting |
| **Props** | Simple, typées | API plus complexe |
| **Hauteur** | `max-h-[85vh]` | Similaire |
| **Overflow** | `hidden` (pas scrollbar) | Similaire |
| **Portal** | Oui | Non toujours |
| **Usage** | Recommandé pour nouveaux projets | Hérité |

### Migration depuis DraggableModal

**Avant:**
```tsx
<DraggableModal isOpen={true} onClose={() => router.back()} title={"..."}>
  <SomeContent />
</DraggableModal>
```

**Après (ModalDraggable):**
```tsx
<ModalDraggable
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="..."
>
  <SomeContent />
</ModalDraggable>
```

### Notes

- Le modal se rend toujours au-dessus du DOM avec `createPortal`
- Le backdrop (fond noir) ferme le modal si cliqué
- Le header avec le bouton X est interactive pour fermer
- L'animation de drag utilise `translate()` pour la performance
- Responsive: Automatiquement 96% de largeur sur mobile
