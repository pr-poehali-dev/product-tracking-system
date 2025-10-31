import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  currentPrice: number;
  originalPrice: number;
  image: string;
  priceHistory: { date: string; price: number }[];
  category: string;
  isFavorite: boolean;
  priceDropAlert: boolean;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    currentPrice: 7999,
    originalPrice: 12999,
    image: '/placeholder.svg',
    category: 'Electronics',
    isFavorite: true,
    priceDropAlert: true,
    priceHistory: [
      { date: '01.10', price: 12999 },
      { date: '08.10', price: 11500 },
      { date: '15.10', price: 9999 },
      { date: '22.10', price: 8500 },
      { date: '29.10', price: 7999 },
    ],
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    currentPrice: 24990,
    originalPrice: 29990,
    image: '/placeholder.svg',
    category: 'Electronics',
    isFavorite: false,
    priceDropAlert: true,
    priceHistory: [
      { date: '01.10', price: 29990 },
      { date: '08.10', price: 28500 },
      { date: '15.10', price: 27000 },
      { date: '22.10', price: 26000 },
      { date: '29.10', price: 24990 },
    ],
  },
  {
    id: '3',
    name: 'Running Shoes',
    currentPrice: 5499,
    originalPrice: 8999,
    image: '/placeholder.svg',
    category: 'Sport',
    isFavorite: true,
    priceDropAlert: false,
    priceHistory: [
      { date: '01.10', price: 8999 },
      { date: '08.10', price: 7500 },
      { date: '15.10', price: 6800 },
      { date: '22.10', price: 6200 },
      { date: '29.10', price: 5499 },
    ],
  },
];

const PriceChart = ({ data }: { data: { date: string; price: number }[] }) => {
  const maxPrice = Math.max(...data.map((d) => d.price));
  const minPrice = Math.min(...data.map((d) => d.price));
  const range = maxPrice - minPrice;

  return (
    <div className="h-32 flex items-end gap-1 px-2">
      {data.map((point, index) => {
        const heightPercent = ((point.price - minPrice) / range) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-primary rounded-t transition-all hover:opacity-80"
              style={{ height: `${heightPercent}%` }}
            />
            <span className="text-[10px] text-muted-foreground">{point.date}</span>
          </div>
        );
      })}
    </div>
  );
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [activeTab, setActiveTab] = useState('all');

  const toggleFavorite = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
    toast.success('Обновлено');
  };

  const toggleAlert = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, priceDropAlert: !p.priceDropAlert } : p))
    );
    toast.success('Уведомления настроены');
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'favorites') return matchesSearch && p.isFavorite;
    if (activeTab === 'alerts') return matchesSearch && p.priceDropAlert;
    return matchesSearch;
  });

  const discount = (original: number, current: number) =>
    Math.round(((original - current) / original) * 100);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="TrendingDown" size={24} className="text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">PriceTracker</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Icon name="Bell" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Settings" size={20} />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Найти товар или добавить по ссылке..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 hover-scale">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Отслеживается</span>
                <Icon name="Eye" size={20} className="text-primary" />
              </div>
              <p className="text-3xl font-bold">{products.length}</p>
            </Card>
            <Card className="p-6 hover-scale">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Снижение цен</span>
                <Icon name="TrendingDown" size={20} className="text-accent" />
              </div>
              <p className="text-3xl font-bold text-accent">
                {products.filter((p) => p.priceDropAlert).length}
              </p>
            </Card>
            <Card className="p-6 hover-scale">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Избранное</span>
                <Icon name="Heart" size={20} className="text-destructive" />
              </div>
              <p className="text-3xl font-bold">
                {products.filter((p) => p.isFavorite).length}
              </p>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">
              <Icon name="Package" size={16} className="mr-2" />
              Все
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Icon name="Heart" size={16} className="mr-2" />
              Избранное
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <Icon name="Bell" size={16} className="mr-2" />
              Уведомления
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover-scale animate-fade-in"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-accent">
                    -{discount(product.originalPrice, product.currentPrice)}%
                  </Badge>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      size="icon"
                      variant={product.isFavorite ? 'default' : 'secondary'}
                      className="h-8 w-8 rounded-full"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Icon
                        name="Heart"
                        size={16}
                        className={product.isFavorite ? 'fill-current' : ''}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant={product.priceDropAlert ? 'default' : 'secondary'}
                      className="h-8 w-8 rounded-full"
                      onClick={() => toggleAlert(product.id)}
                    >
                      <Icon
                        name="Bell"
                        size={16}
                        className={product.priceDropAlert ? 'fill-current' : ''}
                      />
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <Badge variant="outline" className="text-xs mb-2">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold">
                        {product.currentPrice.toLocaleString('ru-RU')} ₽
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>

                  <div className="mb-3 bg-secondary/50 rounded-lg overflow-hidden">
                    <PriceChart data={product.priceHistory} />
                  </div>

                  <Button className="w-full" variant="outline">
                    <Icon name="ExternalLink" size={16} className="mr-2" />
                    Перейти в магазин
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">Товары не найдены</p>
            </div>
          )}
        </TabsContent>
      </main>
    </div>
  );
};

export default Index;
