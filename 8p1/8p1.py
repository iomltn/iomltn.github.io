# -*- coding: utf-8 -*-
from tkinter import *
from tkinter.scrolledtext import *

def par(numero):
    if numero % 2 == 0:
        return True
    else:
        return False

def sequencia(ni, n, pb):
    sequencia = []
    for i in range(ni, n + 1):
        sequencia.append(i)

    c = 8 - (n % 8)
    if c < 8:
        for i in range(c):
            sequencia.append(pb)
    
    return sequencia

def separar(sequencia):
    sequenciaInicial = []
    q = len(sequencia)
    q4 = int(q / 4)
    k = 0
    for i in range(q4):
        lista4 = []
        for j in range(4):
            lista4.append(sequencia[k])
            k = k + 1
        temp = lista4[1]
        lista4[1] = lista4[2]
        lista4[2] = temp
        sequenciaInicial.append(lista4)
    return sequenciaInicial

def ordenar(sequencia):
    sequenciaInicial  = []
    q = len(sequencia)
    qd2 = int(q / 2)
    for s in range(qd2):
        sequenciaInicial.append(sequencia[s])
        sequenciaInicial.append(sequencia[q - 1 - s])

    sequenciaIntermediaria = []
    q = len(sequenciaInicial)
    qd2 = int(q / 2)
    for i in range(0, q, 2):
        temp = []
        for j in range(4):
            if j < 2:
                temp.append(sequenciaInicial[i + 1][3 - j])
                temp.append(sequenciaInicial[i][j])
            else:
                temp.append(sequenciaInicial[i][j])
                temp.append(sequenciaInicial[i + 1][3 - j])
        sequenciaIntermediaria.append(temp)

    sequenciaFinal = []
    for s in sequenciaIntermediaria:
        for si in s:
            sequenciaFinal.append(si)

    return sequenciaFinal

def separarSequencia(sequencia, n):
    sequenciaFinal = []
    temp = []
    if n == 0:
        n = len(sequencia) / 8
    c = 0
    for s in sequencia:
        temp.append(s)
        c += 1
        if c > 0:
            if c % (8 * n) == 0:
                sequenciaFinal.append(temp.copy())
                temp.clear()
    return sequenciaFinal

def listaString(lista):
    novaLista = []
    for i in lista:
        novaLista.append(str(i))
    return novaLista

class Sobre(Toplevel):
	def __init__(self):
		Toplevel.__init__(self)
		#self.frame = Frame()
		#self.frame.__init__(master=None)
		#self.pack()
		self.label = Label(self, text="Milton Rodrigues\niomltn@gmail.com")
		self.label.pack()
	
class Application(Frame):
    def __init__(self, master=None):
        Frame.__init__(self, master)
        self.pack(padx=10,pady=5)
        self.createWidgets()

    def janelaSobre(self):
        Sobre()
    
    def createWidgets(self):
        top = self.winfo_toplevel()
        self.menuBar = Menu(top)
        top['menu'] = self.menuBar
        self.menuBar.add_command(label="Sobre", command=self.janelaSobre)
        
        self.labelSequencia = Label(self, text="Sequência de impressão")
        self.labelSequencia.pack()
        self.textSequencia = ScrolledText(self, width=50, height=10,wrap="word")
        self.textSequencia.pack()
        self.labelPagina1 = Label(self, text="Primeira página")
        self.labelPagina1.pack()
        self.entryPagina1 = Entry(self, justify=CENTER)
        self.entryPagina1.insert(0, "1")
        self.entryPagina1.pack()
        self.labelUltimaPagina = Label(self, text="Última página")
        self.labelUltimaPagina.pack()
        self.entryUltimaPagina = Entry(self, justify=CENTER)
        self.entryUltimaPagina.insert(0, '8')
        self.entryUltimaPagina.pack()
        self.labelPaginaBranco = Label(self, text="Numeração da página em branco")
        self.labelPaginaBranco.pack()
        self.entryPaginaBranco = Entry(self, justify=CENTER)
        self.entryPaginaBranco.insert(0, "#")
        self.entryPaginaBranco.pack()
        self.labelPaginaVez = Label(self, text="Número de páginas por vez ")
        self.labelPaginaVez.pack()
        self.entryPaginasVez = Entry(self, justify=CENTER)
        self.entryPaginasVez.insert(0, "0")
        self.entryPaginasVez.pack()
        self.button = Button(self, text="Obter Sequência", relief=FLAT, command=self.getSequencia)
        self.button.configure(bg="black", fg="white")
        self.button.pack(pady=10)

    def getSequencia(self):
        numeroPaginas = int(self.entryUltimaPagina.get())
        numeroInicial = int(self.entryPagina1.get())
        s = ordenar(separar(sequencia(numeroInicial, numeroPaginas, self.entryPaginaBranco.get())))
        self.textSequencia.delete('1.0', END)
        s = separarSequencia(s, int(self.entryPaginasVez.get()))
        for i in s:
            si = listaString(i)
            t = ",".join(si) + "\n"
            self.textSequencia.insert(END, t)

app = Application()
app.master.title("8 páginas em 1")
app.mainloop()
