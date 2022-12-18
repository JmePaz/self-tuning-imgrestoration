# Self-tuning-imgrestoration
This a Self-Tuning Image Restoration.

- Extraction of Kernel/PSF used in a JPEG file
- Then use the extracted info as a parameters in a unsupervised wiener algorithm for restoration
- Only works for grayscale images (for now)
- Created a Web interface React (Front End) and  Python Flask (Back End)
  - Filter Page 
  - Restoration Page
  
# Dependencies
1.) Python handles the image processing part of this system. Dependencies includes below:</br>
 ``PIL, Matplotlib, Numpy, Scipy, Scikit-learn``</br></br>
2.) React framework also need dependencies on the front end.</br> ``Piexif-JS, Router-Dom``

# Instruction
1.) Upload an Image
![image](https://user-images.githubusercontent.com/105730089/208054529-0c7a34af-0e58-452a-bab0-982d88352c96.png)

2.) Select a filter and its strength  (supports Box Blur, Sharpen, Gaussian Blur, and Sample Blur only)
![image](https://user-images.githubusercontent.com/105730089/208054925-f4698600-fc14-4533-aaab-637b8e30bf04.png)

3.) Download the filtered Image and you can see the filtered info (its type and kernel used) in its properties.
![image](https://user-images.githubusercontent.com/105730089/208055218-6356af1c-b779-4274-8fa5-e595f8af2ca5.png)

4.) Upload the saved filtered image in the restoration page
![image](https://user-images.githubusercontent.com/105730089/208055566-972aad2b-a024-45b6-9a47-dbc1934160a9.png)

5.) save the restored Image

Comparison
![image](https://user-images.githubusercontent.com/105730089/208057455-a63170bb-ea02-47aa-8d4c-3bd40f8edb94.png)

# Acknowledgement
Thanks to my Senior Job Lipat for introducing and helping me with React Framework
