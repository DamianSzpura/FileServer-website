# FileServer-website

is Project made for Event-driven programming in my univesity. Its webpage where you can upload, share and manage files on your own account. You can find full project documentation here: [Dokumentacja-do-projektu](https://drive.google.com/open?id=1uNlhWbRuy907aaJW28uYC5jnoFXWaph2) (only in polish)

![App screen](https://i.ibb.co/P4FkgkZ/1.png)

## Getting Started

### Installing

Create new folder, there will be our main solution file, and folder with our project code.
```
For project you can just create ./Project 
```

Download or clone repository to your new folder and change its name so its look like this
```
From
./Project/FileServer-website/
To
./Project/FileServer website/
```

Cut FileServer website.sln file from folder ./Project/FileServer website into ./Project.
```
File should be found by this path
./Project/FileServer website/FileServer website.sln
```

Open project with Visual Studio and write this NuGet Command Line
```
dotnet restore
```

Run/Build project in Visual Studio
And done!

## Built With

* [Angular](https://angular.io/docs) - The frontend framework used
* [Bootstrap](https://getbootstrap.com/) - Used to create fast and simple html elements
* [Font-Awesome](https://origin.fontawesome.com/) - Used to create icons for files etc.
* [ngx-contextmenu](https://www.npmjs.com/package/ngx-contextmenu) - Used to create contextmenus for file containers
* [ng2-file-upload](https://github.com/valor-software/ng2-file-upload) - Used to create drag and drop file uploading
* [ASP.NET Core](https://docs.microsoft.com/pl-pl/aspnet/core/?view=aspnetcore-2.2) - The backend framework used

## License
MIT
